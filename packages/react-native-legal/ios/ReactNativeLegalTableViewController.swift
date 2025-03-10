class ReactNativeLegalTableViewController: UITableViewController {
    private let CELL_IDENTIFIER = "OSSNoticeCell"
    
    private var data: [ReactNativeLegalLicenseMetadata] = [] {
        didSet {
            tableView.reloadData()
        }
    }
    
    public convenience init(title: String, data: Array<ReactNativeLegalLicenseMetadata>) {
#if os(iOS)
        if #available(iOS 13.0, *) {
            self.init(style: .insetGrouped)
        } else {
            self.init(style: .grouped)
        }
#else
        self.init(style: .grouped)
#endif
        self.title = title
        self.data = data
    }
    
#if os(iOS)
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupCloseButton()
    }
#endif
    
    @objc func dismissTableViewController(_ sender: AnyObject) {
        self.navigationController?.dismiss(animated: true)
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dequeuedCell = tableView.dequeueReusableCell(withIdentifier: CELL_IDENTIFIER) ?? UITableViewCell(style: UITableViewCell.CellStyle.default, reuseIdentifier: CELL_IDENTIFIER)

        let metadata = data[indexPath.row]

        dequeuedCell.textLabel?.text = metadata.name
        dequeuedCell.accessoryType = UITableViewCell.AccessoryType.disclosureIndicator

        return dequeuedCell
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let metadata = data[indexPath.row]
        let detailViewController = ReactNativeLegalDetailViewController(metadata: metadata)

        self.navigationController?.pushViewController(detailViewController, animated: true)
    }
    
#if os(iOS)
    private func setupCloseButton() {
        var barButtonSystemItem: UIBarButtonItem.SystemItem = .done
        if #available(iOS 13.0, *) {
            barButtonSystemItem = .close
        }

        self.navigationItem.leftBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: barButtonSystemItem,
            target: self,
            action: #selector(dismissTableViewController(_:))
        )
    }
#endif
}
